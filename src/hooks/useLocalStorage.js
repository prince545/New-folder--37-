import { useState, useEffect } from 'react';

/**
 * A hook that syncs state to localStorage.
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if no stored value exists
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`[useLocalStorage] Error writing key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
