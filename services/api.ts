type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'API isteği başarısız');
  }

  return data as T;
}

export const authService = {
  login(email: string, password: string) {
    return apiRequest<{ user: { id: string; email: string; name: string; role: string; avatar?: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  register(name: string, email: string, password: string) {
    return apiRequest<{ user: { id: string; email: string; name: string; role: string; avatar?: string } }>('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
  },
  logout() {
    return apiRequest<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
  },
};

export const adminService = {
  getUsers(page = 1, limit = 20) {
    return apiRequest<{
      users: Array<{ id: string; name: string; email: string; role: 'viewer' | 'editor' | 'moderator' | 'admin'; createdAt: string }>;
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/api/admin/users?page=${page}&limit=${limit}`);
  },
  updateUserRole(userId: string, role: 'viewer' | 'editor' | 'moderator' | 'admin') {
    return apiRequest<{ message: string }>('/api/admin/users', {
      method: 'PUT',
      body: { userId, role },
    });
  },
  deleteUser(userId: string) {
    return apiRequest<{ message: string }>('/api/admin/users', {
      method: 'DELETE',
      body: { userId },
    });
  },
};

export const sahabeService = {
  list(params?: { page?: number; limit?: number; search?: string; generation?: string; fourCaliphs?: boolean; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.generation) query.set('generation', params.generation);
    if (params?.fourCaliphs) query.set('fourCaliphs', 'true');
    if (params?.status) query.set('status', params.status);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ sahabeler: Array<Record<string, unknown>>; pagination?: Record<string, unknown> }>(`/api/sahabeler${suffix}`);
  },
  getBySlug(slug: string) {
    return apiRequest<{ sahabe: Record<string, unknown> }>(`/api/sahabeler?slug=${slug}`);
  },
  getById(id: string) {
    return apiRequest<{ sahabe: Record<string, unknown> }>(`/api/sahabeler/${id}`);
  },
  search(search: string, limit = 6) {
    return this.list({ search, limit });
  },
  create(payload: unknown) {
    return apiRequest<{ message: string; sahabe: Record<string, unknown> }>('/api/sahabeler', {
      method: 'POST',
      body: payload,
    });
  },
  update(id: string, payload: unknown) {
    return apiRequest<{ message: string; sahabe: Record<string, unknown> }>(`/api/sahabeler/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },
  remove(id: string) {
    return apiRequest<{ message: string }>(`/api/sahabeler/${id}`, {
      method: 'DELETE',
    });
  },
};

export const eventService = {
  list(params?: { page?: number; limit?: number; category?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.status) query.set('status', params.status);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ events: Array<Record<string, unknown>>; pagination?: Record<string, unknown> }>(`/api/olaylar${suffix}`);
  },
  getBySlug(slug: string) {
    return apiRequest<{ event: Record<string, unknown> }>(`/api/olaylar?slug=${slug}`);
  },
};

export const generationService = {
  list() {
    return apiRequest<{ generations: Array<Record<string, unknown>> }>('/api/nesiller');
  },
};

export const siteSettingsService = {
  get() {
    return apiRequest<{ settings: { id: string; about: Record<string, unknown> } }>('/api/site-settings');
  },
  update(about: unknown) {
    return apiRequest<{ message: string; settings: { id: string; about: Record<string, unknown> } }>('/api/site-settings', {
      method: 'PATCH',
      body: { about },
    });
  },
};

export const favoritesService = {
  list() {
    return apiRequest<{ favorites: Array<Record<string, unknown>> }>('/api/favorites');
  },
  add(sahabeId: string) {
    return apiRequest<{ favorites: Array<Record<string, unknown>>; message: string }>('/api/favorites', {
      method: 'POST',
      body: { sahabeId },
    });
  },
  remove(sahabeId: string) {
    return apiRequest<{ favorites: Array<Record<string, unknown>>; message: string }>('/api/favorites', {
      method: 'DELETE',
      body: { sahabeId },
    });
  },
};

export const moderationService = {
  list(status: string) {
    return apiRequest<{ items: Array<Record<string, unknown>>; stats: Record<string, number> }>(`/api/moderate/list?status=${status}`);
  },
  moderateSahabe(id: string, action: 'approve' | 'reject', moderationNote?: string) {
    return apiRequest<{ message: string }>(`/api/moderate/sahabe/${id}`, {
      method: 'PATCH',
      body: { action, moderationNote },
    });
  },
};
