document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toysUrl = 'http://localhost:3000/toys'; // Your API endpoint
  const addToyForm = document.getElementById('add-toy-form');

  // Fetch and display existing toys
  fetch(toysUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(toy => {
        addToyToDOM(toy);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));

  // Function to add a toy to the DOM
  function addToyToDOM(toy) {
    const toyCard = document.createElement('div');
    toyCard.classList.add('card');
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" alt="${toy.name}" style="width:200px;">
      <p>Likes: <span class="like-count">${toy.likes}</span></p>
      <button class="like-btn">Like <3</button>
    `;
    toyCollection.appendChild(toyCard);

    // Add event listener to the like button
    toyCard.querySelector('.like-btn').addEventListener('click', () => {
      increaseLikeCount(toyCard, toy.id);
    });
  }

  // Handle form submission
  addToyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addToyForm);
    const newToy = {
      name: formData.get('name'),
      image: formData.get('image'),
      likes: 0
    };

    // Send POST request to add the new toy
    fetch(toysUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        addToyToDOM(toy); // Add new toy to the DOM
        addToyForm.reset(); // Reset the form
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Function to increase like count
  function increaseLikeCount(toyCard, toyId) {
    const likeCountElement = toyCard.querySelector('.like-count');
    let likes = parseInt(likeCountElement.textContent);
    likes += 1;
    likeCountElement.textContent = likes;

    // Send PATCH request to update likes on the server
    fetch(`${toysUrl}/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: likes })
    })
      .catch(error => console.error('Error updating likes:', error));
  }
});
