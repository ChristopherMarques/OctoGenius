'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface StudyState {
    currentSubject: string | null;
    studyTime: number;
    completedTopics: string[];
    dailyProgress: number;
    loading: boolean;
}

type StudyAction =
    | { type: 'SET_SUBJECT'; payload: string }
    | { type: 'ADD_STUDY_TIME'; payload: number }
    | { type: 'COMPLETE_TOPIC'; payload: string }
    | { type: 'SET_DAILY_PROGRESS'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean };

const StudyContext = createContext<{
    state: StudyState;
    dispatch: React.Dispatch<StudyAction>;
}>({ state: {} as StudyState, dispatch: () => null });

const initialState: StudyState = {
    currentSubject: null,
    studyTime: 0,
    completedTopics: [],
    dailyProgress: 0,
    loading: true,
};

function studyReducer(state: StudyState, action: StudyAction): StudyState {
    switch (action.type) {
        case 'SET_SUBJECT':
            return { ...state, currentSubject: action.payload };
        case 'ADD_STUDY_TIME':
            return { ...state, studyTime: state.studyTime + action.payload };
        case 'COMPLETE_TOPIC':
            return {
                ...state,
                completedTopics: [...state.completedTopics, action.payload],
            };
        case 'SET_DAILY_PROGRESS':
            return { ...state, dailyProgress: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(studyReducer, initialState);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadStudyData();
        }
    }, [user]);

    const loadStudyData = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { data: studyData, error } = await supabase
                .from('study_progress')
                .select('*')
                .eq('user_id', user?.id)
                .single();

            if (error) throw error;

            if (studyData) {
                dispatch({ type: 'SET_SUBJECT', payload: studyData.current_subject });
                dispatch({ type: 'SET_DAILY_PROGRESS', payload: studyData.daily_progress });
                // Carregar outros dados conforme necessário
            }
        } catch (error) {
            console.error('Erro ao carregar dados de estudo:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <StudyContext.Provider value={{ state, dispatch }}>
            {children}
        </StudyContext.Provider>
    );
}

export const useStudy = () => useContext(StudyContext); 