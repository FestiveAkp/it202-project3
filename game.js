const canvas = document.querySelector('#canvas');
const ctx = c.getContext('2d');

const draw = () => {
    // ...

    window.requestAnimationFrame(draw);
}

draw();
