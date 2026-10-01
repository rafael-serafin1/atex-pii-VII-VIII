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
