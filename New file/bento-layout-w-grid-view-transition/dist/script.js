// 🦔 ref: https://codepen.io/argyleink/pen/BaGrXmv

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.onclick = e => {
    if (!document.startViewTransition) return
    
    e.preventDefault()
    
    document.startViewTransition(()=> {
      e.target.checked = true
    })
  }
})