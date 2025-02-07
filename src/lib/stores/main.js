import { readable, writable } from 'svelte/store';
import { user } from './user';

// export const api = readable('http://localhost:3000');
// export const api = readable('https://www.expressfeel.com');

export const user_segments = writable([]);
export const showToc = writable(false);
export const showProgressNav = writable(false);
export const loading_branches = writable(false);
export const loading_commits = writable(false);
export const blind = writable(false);
export const branch = writable(null);
export const user_branch_pages = writable(null);
export const selected_user_page = writable(null);
export const current_page_number = writable(2);
export const current_page = writable(null);
export const showVerseRefSearcher = writable(false);
export const showStats = writable(false);
export const viewingAs = writable(null);
export const tocList = writable([]);

user.subscribe((u) => {
	if (u) {
		viewingAs.set(u);
	}
});

export const goHome = () => {
	selectedExpression.set(null);
	selectedTrait.set(null);
};

export const signIn = () => {
	selectedExpression.set(null);
	selectedTrait.set(null);
};
