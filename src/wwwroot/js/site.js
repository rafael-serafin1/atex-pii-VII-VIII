// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
const navGroups = document.querySelectorAll('.nav-group');

navGroups.forEach((group) => {
	group.addEventListener('toggle', () => {
		if (group.open) {
			navGroups.forEach((otherGroup) => {
				if (otherGroup !== group) 
					otherGroup.open = false;
			});
		}
	});
});

const adminTokenKey = 'navcode.adminToken';
const adminDialog = document.querySelector('[data-admin-dialog]');
const adminLoginButton = document.querySelector('[data-admin-login]');
const adminLoginForm = document.querySelector('[data-admin-login-form]');
const adminError = document.querySelector('[data-admin-error]');
const adminCancelButton = document.querySelector('[data-admin-cancel]');
const adminLogoutButton = document.querySelector('[data-admin-logout]');
const adminSessionActive = document.body.dataset.adminSession === 'true';

adminLoginButton?.addEventListener('click', () => {
	if (adminDialog instanceof HTMLDialogElement)
		adminDialog.showModal();
});

adminCancelButton?.addEventListener('click', () => {
	if (adminDialog instanceof HTMLDialogElement)
		adminDialog.close();
});

adminLoginForm?.addEventListener('submit', async (event) => {
	event.preventDefault();
	const formData = new FormData(adminLoginForm);
	const token = formData.get('token');

	if (typeof token !== 'string' || token.trim() === '')
		return;

	try {
		localStorage.setItem(adminTokenKey, token);
		const response = await fetch('/admin/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		});

		if (!response.ok) {
			localStorage.removeItem(adminTokenKey);
			if (adminError instanceof HTMLElement)
				adminError.textContent = response.status === 503
					? 'O acesso administrativo ainda não foi configurado no servidor.'
					: 'Token inválido.';
			return;
		}

		window.location.reload();
	} catch {
		localStorage.removeItem(adminTokenKey);
		if (adminError instanceof HTMLElement)
			adminError.textContent = 'Não foi possível autenticar. Verifique a conexão e tente novamente.';
	}
});

adminLogoutButton?.addEventListener('click', async () => {
	try {
		const response = await fetch('/admin/logout', { method: 'POST' });
		if (!response.ok)
			throw new Error('Falha ao encerrar sessão administrativa.');

		localStorage.removeItem(adminTokenKey);
		window.location.reload();
	} catch {
		window.alert('Não foi possível encerrar a sessão administrativa.');
	}
});

if (!adminSessionActive) {
	const storedToken = localStorage.getItem(adminTokenKey);
	if (storedToken) {
		fetch('/admin/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: storedToken })
		}).then((response) => {
			if (response.ok)
				window.location.reload();
			else if (response.status === 401)
				localStorage.removeItem(adminTokenKey);
		}).catch((error) => {
			console.error('Não foi possível restaurar a sessão administrativa.', error);
		});
	}
}

const cameraButton = document.querySelector('[data-camera-start]');
const cameraVideo = document.querySelector('[data-camera-video]');
const cameraPlaceholder = document.querySelector('[data-camera-placeholder]');
const cameraStatus = document.querySelector('[data-camera-status]');
const attendanceCode = document.querySelector('[data-attendance-code]');
const presenceForm = document.querySelector('.presence-code-form');

if (cameraButton instanceof HTMLButtonElement && cameraVideo instanceof HTMLVideoElement && cameraStatus instanceof HTMLElement) {
	let cameraStream;
	let cameraActive = false;

	const stopCamera = () => {
		cameraActive = false;
		cameraStream?.getTracks().forEach((track) => track.stop());
		cameraStream = undefined;
		cameraVideo.srcObject = null;
		cameraVideo.hidden = true;
		if (cameraPlaceholder instanceof HTMLElement)
			cameraPlaceholder.hidden = false;
		cameraButton.textContent = 'ATIVAR CÂMERA';
	};

	const readQrCode = async (detector) => {
		if (!cameraActive)
			return;

		try {
			const codes = await detector.detect(cameraVideo);
			if (codes.length > 0) {
				let code = codes[0].rawValue.trim();
				try {
					const qrUrl = new URL(code);
					code = qrUrl.searchParams.get('codigo') ?? qrUrl.searchParams.get('code') ?? code;
				} catch {}
				if (attendanceCode instanceof HTMLInputElement)
					attendanceCode.value = code;
				stopCamera();
				cameraStatus.textContent = 'QR Code lido. Confira o código e confirme sua presença.';
				attendanceCode?.focus();
				return;
			}
		} catch {
			cameraStatus.textContent = 'Não foi possível ler o QR Code. Você também pode informar o código abaixo.';
			return;
		}

		if (cameraActive)
			window.setTimeout(() => readQrCode(detector), 250);
	};

	cameraButton.addEventListener('click', async () => {
		if (cameraActive) {
			stopCamera();
			cameraStatus.textContent = 'Câmera desativada.';
			return;
		}
		if (!navigator.mediaDevices?.getUserMedia) {
			cameraStatus.textContent = 'A câmera requer um contexto seguro (HTTPS ou localhost) e suporte do navegador.';
			return;
		}
		cameraButton.disabled = true;
		cameraStatus.textContent = 'Aguardando autorização para acessar a câmera...';
		try {
			cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
			cameraVideo.srcObject = cameraStream;
			await cameraVideo.play();
			if (cameraVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA)
				await new Promise((resolve) => cameraVideo.addEventListener('loadeddata', resolve, { once: true }));
			cameraActive = true;
			cameraVideo.hidden = false;
			if (cameraPlaceholder instanceof HTMLElement)
				cameraPlaceholder.hidden = true;
			cameraButton.textContent = 'DESATIVAR CÂMERA';
			if ('BarcodeDetector' in window) {
				const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
				cameraStatus.textContent = 'Aponte a câmera para o QR Code exibido pelo administrador.';
				readQrCode(detector);
			} else {
				cameraStatus.textContent = 'Câmera ativa. Digite o código exibido junto do QR Code para continuar.';
			}
		} catch (error) {
			stopCamera();
			cameraStatus.textContent = error.name === 'NotAllowedError'
				? 'Permissão da câmera negada. Autorize o acesso no navegador ou informe o código abaixo.'
				: 'Não foi possível iniciar a câmera. Verifique o dispositivo ou use o código abaixo.';
		} finally {
			cameraButton.disabled = false;
		}
	});
	
	presenceForm?.addEventListener('submit', stopCamera);
	window.addEventListener('pagehide', stopCamera);
}

// Write your JavaScript code.
