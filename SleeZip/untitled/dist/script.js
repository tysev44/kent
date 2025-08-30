document.addEventListener('DOMContentLoaded', () => {
	const addButton = document.getElementById('add');
	const removeButton = document.getElementById('remove');
	const list = document.querySelector('.list-container');
	const ul = list.querySelector('ul');
	
	let itemCount = list.children.length;
	
	ul.querySelectorAll('li').forEach((entry, i) => {
		entry.style.viewTransitionName = `item-${i}`;
	})

	const isViewTransitionSupported = typeof document.startViewTransition === 'function';

	if (!isViewTransitionSupported) {
		unsupportedMessage.style.display = 'block';
	}

	const addItem = () => {
		itemCount++;
		
		const newItem = document.createElement('li');
		
		newItem.style.viewTransitionName = `item-${itemCount}`;
		
		newItem.textContent = `Item ${itemCount}`;
		
		ul.appendChild(newItem);
	};

	const removeItem = () => {
		const lastItem = ul.lastElementChild;
		
		if (lastItem) {
			ul.removeChild(lastItem);
		}
	};

	addButton.addEventListener('click', () => {
		if (!isViewTransitionSupported) {
			addItem();
			
			return;
		}
		
		document.startViewTransition(() => {
			addItem();
		});
	});

	removeButton.addEventListener('click', () => {
		if (!isViewTransitionSupported) {
			removeItem();
			
			return;
		}
		
		document.startViewTransition(() => {
			removeItem();
		});
	});
});