import type {Category} from "../utils/types.ts";

type CategoriesResponse = {
    categories: Category[];
};

export async function getCategories():Promise<Category[]>{
    const res=await fetch("/api/allCategories",{
        method:"GET",
        headers:{"Content-Type":"application/json"}
    })

    const text = await res.text();
    if(!res.ok){
        throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const data: CategoriesResponse = text ? JSON.parse(text) : { categories: [] };
    return data.categories ?? [];
}