let headline = document.querySelector('[data-remaining]');
let sections = document.querySelectorAll('section');
let amount = {
  start: 250000,
  current: 0
}
let url = "https://s3.amazonaws.com/franklin-assets/static/test/test.json"
let request = new XMLHttpRequest();
request.open('GET', url, true);
request.onload = () => {
  if(request.readyState == 4 && request.status == 200){
    let response = request.responseText;
    amount.current = JSON.parse(response).amount;
    animate()  
  }
  else {
    amount.current = 250000;
    animate()
  }
}

// Animations
let animate = () => {
  anime({
    targets: amount,
    current: [amount.start,amount.current],
    duration: 5000,
    easing: 'linear',
    update: () => {
      headline.innerHTML = "$" + Math.round(amount.current).toLocaleString();
    }
  }) 
}
let reveal = (section) => {
  console.log(section);
  let masked = section.querySelectorAll('[data-masked]')
  masked.forEach( (element, index) => {
    element.dataset.reveal = element.dataset.masked;
    element.style.animationDelay = `${index * 0.3}s`;    
  })
}

// Intersection Observer
let observation = (entries) => {
  entries.forEach( (entry, index) => {
    if(entry.intersectionRatio >= 0.25){
      entry.target.dataset.active = true;
      reveal(entry.target)
    }
    else {
      entry.target.dataset.active = false;
    }
  })
}
let observer = new IntersectionObserver(observation, {threshold: [0,0.25,0.5,0.75]});
let buildIO = () => {
  for(let section of sections) {
    observer.observe(section)  
  }  
}

// On load complete
document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout( () => {
    request.send();
    buildIO();
  }, 300)
});