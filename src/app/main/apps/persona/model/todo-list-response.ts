import { Persona } from './persona';

export interface TodoListResponse {
    content: Persona[];
    totalElements: number;
}