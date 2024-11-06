document.addEventListener('DOMContentLoaded', () => {
  const draggableElements = document.querySelectorAll('.box, .rectangle-horizontal');

  draggableElements.forEach(element => {
    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend', dragEnd);
  });

  function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
      e.target.classList.add('hide');
    }, 0);
  }

  function dragEnd(e) {
    e.target.classList.remove('hide');
  }

  // Setup drop zones for the draggable elements
  // Ensure that the drop zones are designated and have appropriate event listeners
  const dropZones = document.querySelectorAll('.drop-zone');

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();  // Necessary to allow drop
      e.target.classList.add('over');
    });

    zone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.target.classList.add('over');
    });

    zone.addEventListener('dragleave', (e) => {
      e.target.classList.remove('over');
    });

    zone.addEventListener('drop', (e) => {
      e.target.classList.remove('over');
      // Get the draggable element's ID from the data transfer
      const id = e.dataTransfer.getData('text/plain');
      const draggable = document.getElementById(id);

      // Append the draggable element to the drop zone
      e.target.appendChild(draggable);
      draggable.classList.remove('hide');
    });
  });
});
