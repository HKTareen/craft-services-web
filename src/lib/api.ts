import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "./auth";

/** Returns a 401 response if the caller is not an authenticated admin, else null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type ListFns<T> = {
  list: () => Promise<T[]>;
  create: (data: Omit<T, "id">) => Promise<T>;
};

type ItemFns<T> = {
  update: (id: string, data: Partial<T>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
};

/** Build GET (public) + POST (admin) handlers for a collection. */
export function collectionRoute<T>({ list, create }: ListFns<T>) {
  return {
    GET: async () => NextResponse.json(await list()),
    POST: async (request: Request) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      const body = (await request.json()) as Omit<T, "id">;
      const created = await create(body);
      return NextResponse.json(created, { status: 201 });
    },
  };
}

/** Build PUT + DELETE (admin) handlers for a single item by id. */
export function itemRoute<T>({ update, remove }: ItemFns<T>) {
  type Ctx = { params: Promise<{ id: string }> };
  return {
    PUT: async (request: Request, { params }: Ctx) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      const { id } = await params;
      const body = (await request.json()) as Partial<T>;
      const ok = await update(id, body);
      if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    },
    DELETE: async (_request: Request, { params }: Ctx) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      const { id } = await params;
      const ok = await remove(id);
      if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    },
  };
}
