const header = document.querySelector('header');

const handleScroll = () => {
  const rect = header?.getBoundingClientRect();
  if (!rect) return;

  if (rect.top === 32 && !header.classList.contains('sticky')) {
    document.startViewTransition(() => {
      header.classList.add('sticky');
    });
  } else if (rect.top > 32 && header.classList.contains('sticky')) {
    document.startViewTransition(() => {
      header.classList.remove('sticky');
    });
  }
};

document.addEventListener('scroll', handleScroll);
