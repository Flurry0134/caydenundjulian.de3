// src/context/ChatContext.tsx

// ... (alle anderen Imports und der Code darüber bleiben gleich) ...

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (useState, useEffects, createNewSession, loadSession, toggleCitationMode bleiben gleich) ...

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentSession) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      // --- ANPASSUNG HIER: API URL ---
      // Ersetze dies mit deiner öffentlichen ngrok-URL (während des Tests)
      // oder später mit deiner finalen, öffentlich gehosteten Backend-URL.
      const apiUrl = 'https://c336-78-42-249-25.ngrok-free.app/ask'; 
      // Zum Beispiel: const apiUrl = 'https://c336-78-42-249-25.ngrok-free.app/ask'; // Deine letzte ngrok URL
      // Oder für rein lokale Tests (wenn Frontend auch lokal läuft und Backend auch):
      // const apiUrl = 'http://localhost:8888/ask'; 

      console.log(`Sende Anfrage an: ${apiUrl} mit Frage: ${content}`); // Debug-Ausgabe

      const response = await fetch(apiUrl, { // <--- Verwende die Variable apiUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: content })
      });

      if (!response.ok) {
        // Versuche, mehr Details aus der Fehlerantwort zu bekommen
        const errorData = await response.json().catch(() => ({ detail: `API error: ${response.status} ${response.statusText}` }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data = await response.json(); // data ist vom Typ AnswerResponse deiner API
      
      // Convert API sources to Citations format
      const citations: Citation[] = data.sources_list?.map((source: any, index: number) => ({
        id: index.toString(), // Simple ID basierend auf Index
        text: source.content,
        source: source.metadata?.source || 'Unknown source',
        url: source.metadata?.url
      })) || [];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer_display_text,
        sender: 'bot',
        timestamp: new Date(),
        citations: isCitationMode ? citations : undefined
      };
      
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      
      // Update der aktuellen Session mit den neuen Nachrichten
      const updatedSessionData = { // Benenne die Variable um, um Konflikt mit globalem 'updatedSession' zu vermeiden
        ...currentSession,
        messages: newMessages,
        updatedAt: new Date()
      };
      
      setCurrentSession(updatedSessionData);
      setSessions(sessions.map(s => s.id === updatedSessionData.id ? updatedSessionData : s));

    } catch (error: any) {
      console.error('Chat submission error:', error);
      
      const errorMessageContent = error.message || 'Failed to get response from AI system. Please try again.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessageContent,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (exportChat und der Rest des Providers bleiben gleich) ...
  return (
    <ChatContext.Provider value={{
      currentSession,
      sessions,
      messages,
      isCitationMode,
      isLoading,
      toggleCitationMode,
      sendMessage,
      createNewSession,
      loadSession,
      exportChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};