export const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

// Fixed colours for the default categories; categories the user creates get a colour picked from their name.
const CATEGORY_COLORS = {
  Food: '#F97316', Transport: '#38BDF8', Bills: '#F43F5E', Shopping: '#A78BFA',
  Education: '#6366F1', Entertainment: '#EAB308', Other: '#94A3B8',
};
const PALETTE = ['#22C55E', '#2DD4BF', '#F472B6', '#FB923C', '#60A5FA', '#C084FC', '#FACC15', '#34D399'];

export const colorFor = (name = '') => {
  if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};
