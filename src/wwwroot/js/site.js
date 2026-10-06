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
