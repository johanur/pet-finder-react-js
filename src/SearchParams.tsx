import React, { useContext, useState } from 'react';
import Results from './Results';
import useBreedList from './hooks/useBreedList';
import fetchSearch from './fetchApi/fetchSearch';
import { useQuery } from '@tanstack/react-query';
import AdoptedPetContext from './AdoptedPetContext';

const ANIMALS = ['bird', 'cat', 'dog', 'rabbit', 'reptile'];

const SearchParams = () => {
  const [animal, setAnimal] = useState('');
  const [breeds] = useBreedList(animal);
  const [adoptedPet] = useContext(AdoptedPetContext);

  const [requestParams, setRequestParams] = useState({
    location: '',
    animal: '',
    breed: '',
  });

  const results = useQuery(['pets', requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {
      animal: formData.get('animal') ?? '',
      breed: formData.get('breed') ?? '',
      location: formData.get('location') ?? '',
    };
    setRequestParams(obj);
  }

  return (
    <div className="my-0 mx-auto w-11/12">
      <form
        className="p-10 mb-10 rounded-lg bg-gray-200 shadow-lg flex flex-col justify-center items-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}

        <label htmlFor="location">
          Location
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            className="search-input"
          />
        </label>

        <label htmlFor="animal">
          Animal
          <select
            id="animal"
            value={animal}
            className="search-input"
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>

        <label htmlFor="breed">
          Breed
          <select
            id="breed"
            name="breed"
            className="search-input grayed-out-disabled"
            disabled={breeds.length === 0}
          >
            <option />
            {breeds.map((breed) => (
              <option key={breed}>{breed}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded px-6 py-2 text-white hover:opacity-50 border-none bg-orange-500"
        >
          Submit
        </button>
      </form>

      {results.isLoading ? (
        <div className="loading-pane">
          <h2 className="loader">🌀</h2>
        </div>
      ) : (
        <Results pets={pets} />
      )}
    </div>
  );
};

export default SearchParams;
