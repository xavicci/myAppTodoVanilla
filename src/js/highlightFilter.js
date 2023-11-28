import { nodeFilters } from "./nodes";

export function highlightFilter() {

    for (const child of nodeFilters.children) {
        child.firstElementChild.classList.remove('selected');
        const href = child.firstElementChild.getAttribute('href');
        if (location.hash == href) {
            child.firstElementChild.classList.add('selected');
        }
    }
}
