import useFetch from './useFetch.js';
import { categoryApi } from '../services/api.js';

// The user's categories from MongoDB, used by the transaction form, the filter bar and the Categories page.
export default function useCategories() {
  const { data, loading, error, reload } = useFetch(categoryApi.list, []);
  const categories = data || [];
  return { categories, names: categories.map((c) => c.name), loading, error, reload };
}
