import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Retrieve stored value from localStorage or use the initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(error);
            return initialValue;
        }
    });

    // Update localStorage whenever the state changes
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
