const background = document.getElementById("background");

for (let i = 0; i < 800; i++) { // cantidad de bolitas
    const particle = document.createElement("div");
    particle.classList.add("particle");

  // tamaño aleatorio
  const size = Math.random() * 4 + 2; // entre 2px y 6px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

  // posición inicial aleatoria
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.top = `${Math.random() * 100}vh`;

  // duración aleatoria
  particle.style.animationDuration = `${10 + Math.random() * 20}s`;

    background.appendChild(particle);
}
