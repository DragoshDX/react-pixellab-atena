export const render = (pet) => {
  const { name, species, age, id } = pet;
  const container = document.createElement('article');
  container.classList.add('pet', 'mt-3');
  container.dataset.petId = id;

  container.innerHTML = `
    <h1>${name}</h1>
    <ul>
      <li>Age: ${age}</li>
      <li>Species: ${species}</li>
    </ul>

    <button title="Delete"
      type="button"
      class="btn btn-secondary"
    >Delete</button>

    <button title="Edit"
      type="button"
      class="btn btn-secondary"
    >Edit</button>
  `;

  return container;
};
