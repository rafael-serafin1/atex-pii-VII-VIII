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

document.querySelectorAll('[data-presence-checkbox]').forEach((checkbox) => {
	if (!(checkbox instanceof HTMLInputElement))
		return;

	const observation = document.querySelector(`[data-absence-observation="${checkbox.dataset.presenceCheckbox}"]`);
	if (!(observation instanceof HTMLTextAreaElement))
		return;

	const updateObservationState = () => {
		observation.disabled = checkbox.checked;
		if (checkbox.checked)
			observation.value = '';
	};

	checkbox.addEventListener('change', updateObservationState);
	updateObservationState();
});
