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
 
const attendanceDialog = document.querySelector('.attendance-dialog');

if (attendanceDialog instanceof HTMLDialogElement) {
	const closeButton = attendanceDialog.querySelector('.modal-close');
	const rowContainer = attendanceDialog.querySelector('.attendance-rows');

	document.querySelectorAll('.attendance-trigger').forEach((button) => {
		button.addEventListener('click', () => {
			const source = document.querySelector(`.attendance-source[data-lesson="${button.dataset.lesson}"]`);

			if (!source || !rowContainer) 
				return;

			attendanceDialog.querySelector('#attendance-title').textContent 	= source.dataset.title;
			attendanceDialog.querySelector('#attendance-date').textContent 		= `${source.dataset.day} · ${source.dataset.time}`;
			attendanceDialog.querySelector('#present-count').textContent 		= source.dataset.present;
			attendanceDialog.querySelector('#absent-count').textContent 		= source.dataset.absent;
			attendanceDialog.querySelector('#excused-count').textContent 		= source.dataset.excused;

			const students = [...source.querySelectorAll('[data-registration]')];

			rowContainer.replaceChildren(...students.map((student) => {
				const row = document.createElement('div');
				row.className = 'attendance-row';

				const registration = document.createElement('span');
				registration.className = 'registration';
				registration.textContent = student.dataset.registration;

				const name = document.createElement('span');
				name.textContent = student.dataset.name;

				const status = document.createElement('span');
				status.className = `presence-badge presence-${student.dataset.status}`;
				status.textContent = ({ presente: 'PRESENTE', ausente: 'AUSENTE', justificado: 'JUSTIFICADO' })[student.dataset.status] ?? '';

				row.append(registration, name, status);
				return row;
			}));

			attendanceDialog.querySelector('#attendance-total').textContent = 
				`${students.length} aluno${students.length === 1 ? '' : 's'} matriculado${students.length === 1 ? '' : 's'} · clique fora para fechar`;

			attendanceDialog.showModal();
		});
	});

	closeButton?.addEventListener('click', () => attendanceDialog.close());
	
	attendanceDialog.addEventListener('click', (event) => {
		if (event.target === attendanceDialog) 
			attendanceDialog.close();
	});
}

// Write your JavaScript code.
