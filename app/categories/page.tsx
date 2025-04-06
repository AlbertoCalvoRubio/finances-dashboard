import { getAllCategories } from "../../lib/categories/actions";

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  console.log("Categories:", categories);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.name}>
            {category.name} - {category.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
