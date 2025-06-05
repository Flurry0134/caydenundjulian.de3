import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Stelle sicher, dass der Pfad zu deinen Typdefinitionen korrekt ist
// z.B. import { Message, ChatSession, Citation } from '../types';

// Annahme der Typdefinitionen (füge deine tatsächlichen hinzu oder importiere sie aus ../types)
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: Citation[];
  isError?: boolean;
}

interface Citation {
  id: string;
  text: string;
  source: string;
  url?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
// Ende Annahme Typdefinitionen


interface ChatContextType {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: Message[];
  isCitationMode: boolean;
  isLoading: boolean;
  toggleCitationMode: () => void;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  exportChat: (format: 'pdf' | 'txt' | 'json') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => { // Sicherstellen, dass useChat exportiert wird
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCitationMode, setIsCitationMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Helfersfunktion für createNewSession, um Code-Duplizierung zu vermeiden
  const _createNewSessionLogic = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: `Chat ${sessions.filter(s => s.id !== newSessionId).length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSessions(prevSessions => [newSession, ...prevSessions.filter(s => s.id !== newSession.id)]);
    setCurrentSession(newSession);
    setMessages([]);
    return newSession;
  };

  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    let activeSessionFound = false;
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        setSessions(parsedSessions);
        
        const lastSessionId = localStorage.getItem('lastSessionId');
        if (lastSessionId) {
          const lastSession = parsedSessions.find((s: ChatSession) => s.id === lastSessionId);
          if (lastSession) {
            setCurrentSession(lastSession);
            setMessages(lastSession.messages);
            activeSessionFound = true;
          }
        }
        
        if (!activeSessionFound && parsedSessions.length > 0) {
            setCurrentSession(parsedSessions[0]); // Lade die neueste (erste) Session
            setMessages(parsedSessions[0].messages);
            activeSessionFound = true;
        }
      } catch (error) {
        console.error("Fehler beim Parsen der Sessions aus localStorage:", error);
        localStorage.removeItem('chatSessions');
        localStorage.removeItem('lastSessionId');
      }
    }
    if (!activeSessionFound) {
      _createNewSessionLogic(); // Erstelle eine neue Session, wenn keine geladen werden konnte
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Leeres Array, um nur beim Mounten auszuführen

  useEffect(() => {
    if (sessions.length > 0 || localStorage.getItem('chatSessions') !== null) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('lastSessionId', currentSession.id);
    } else {
      localStorage.removeItem('lastSessionId');
    }
  }, [currentSession]);
  
  const createNewSession = () => {
    _createNewSessionLogic();
  };

  const ensureSession = (): ChatSession => {
    return currentSession || _createNewSessionLogic();
  };

  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setMessages(session.messages);
    }
  };

  const toggleCitationMode = () => {
    setIsCitationMode(!isCitationMode);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const sessionToUpdate = ensureSession();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    const currentMessagesWithUser = [...sessionToUpdate.messages, userMessage];
    setMessages(currentMessagesWithUser);

    const tempUpdatedSession: ChatSession = {
        ...sessionToUpdate,
        messages: currentMessagesWithUser,
        updatedAt: new Date(),
    };
    setCurrentSession(tempUpdatedSession);
    setSessions(prevSessions => prevSessions.map(s => s.id === tempUpdatedSession.id ? tempUpdatedSession : s));
    setIsLoading(true);
    
    try {
      // =======================================================================
      // SEHR WICHTIG: ERSETZE DIESE URL MIT DEINER AKTUELLEN NGROK-URL + "/ask"
      // Beispiel: const apiUrl = 'https://<deine-neue-ngrok-id>.ngrok-free.app/ask';
      // =======================================================================
      const apiUrl = 'https://35f6-78-42-249-25.ngrok-free.app/ask'; // ERSETZE DIES MIT DEINER AKTUELLEN NGROK URL!

      console.log(`Sende Anfrage an: ${apiUrl} mit Frage: "${content}"`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: content }) 
      });

      if (!response.ok) {
        // Versuche, mehr Details aus der Fehlerantwort zu bekommen
        const errorData = await response.json().catch(() => ({ detail: `API error: ${response.status} ${response.statusText}` }));
        console.error('API Error Response:', errorData); // Logge die Fehlerdaten vom Server
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data = await response.json(); // data ist vom Typ AnswerResponse deiner API
      
      const citations: Citation[] = data.sources_list?.map((source: any, index: number) => ({
        id: `citation-${Date.now()}-${index}`,
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
      
      const finalMessages = [...currentMessagesWithUser, botMessage];
      setMessages(finalMessages);
      
      const finalUpdatedSession: ChatSession = {
        ...tempUpdatedSession, 
        messages: finalMessages,
        updatedAt: new Date()
      };
      
      setCurrentSession(finalUpdatedSession);
      setSessions(prevSessions => prevSessions.map(s => s.id === finalUpdatedSession.id ? finalUpdatedSession : s));

    } catch (error: any) {
      console.error('Chat submission error / Failed to fetch:', error); // Detaillierteres Logging
      
      const errorMessageContent = error.message || 'Failed to get response. Please try again.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${errorMessageContent}`, // Mache den Fehler im Chat sichtbarer
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      const messagesWithError = [...currentMessagesWithUser, errorMessage];
      setMessages(messagesWithError);

      const sessionWithError: ChatSession = {
          ...tempUpdatedSession,
          messages: messagesWithError,
          updatedAt: new Date()
      };
      setCurrentSession(sessionWithError);
      setSessions(prevSessions => prevSessions.map(s => s.id === sessionWithError.id ? sessionWithError : s));
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = (format: 'pdf' | 'txt' | 'json') => {
    const sessionToExport = currentSession || (sessions.length > 0 ? sessions[0] : null);
    if (!sessionToExport) return;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(sessionToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `chat-export-${new Date(sessionToExport.createdAt).toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();
    } else {
      alert(`Export als ${format.toUpperCase()} ist in diesem Beispiel nicht vollständig implementiert.`);
    }
  };

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
