// Czekamy, aż cała strona HTML zostanie załadowana, zanim zaczniemy działać z elementami
document.addEventListener('DOMContentLoaded', () => {
    // 1. Znajdujemy elementy HTML, z którymi będziemy pracować
    const promptInput = document.getElementById('promptInput'); // Pole tekstowe do wpisywania pytania
    const generateBtn = document.getElementById('generateBtn');   // Przycisk "Wygeneruj Ciekawostkę"
    const ciekawostkaOutput = document.getElementById('ciekawostkaOutput'); // Miejsce na wyświetlanie wyniku

    // 2. Dodajemy "nasłuchiwanie" na kliknięcie przycisku
    generateBtn.addEventListener('click', async () => {
        const userPrompt = promptInput.value;

        if (userPrompt.trim() === '') {
            ciekawostkaOutput.textContent = 'Proszę wpisać temat ciekawostki!';
            return;
        }

        ciekawostkaOutput.textContent = 'Generuję ciekawostkę... Proszę czekać.';

        try {
            // Zmieniamy ścieżkę do Serverless Function na /api/gemini
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userPrompt }), // Wysyłamy prompt
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Błąd serwera: ${response.status} - ${errorData.error || 'Nieznany błąd'}`);
            }

            const data = await response.json();
            
            // Zmieniamy 'generatedText' na 'reply', bo taki jest klucz w odpowiedzi z api/gemini.js
            if (data.reply) {
                ciekawostkaOutput.textContent = data.reply;
            } else {
                ciekawostkaOutput.textContent = 'Nie udało się wygenerować ciekawostki. Spróbuj ponownie.';
            }

        } catch (error) {
            // 5. Obsługujemy błędy (np. brak połączenia, błąd serwera)
            console.error('Wystąpił błąd:', error);
            ciekawostkaOutput.textContent = `Wystąpił błąd: ${error.message}. Spróbuj ponownie.`;
        }
    });
});