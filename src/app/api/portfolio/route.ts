import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/portfolio";
import { isAdminAuthenticated } from "@/lib/auth";
import type { ProjectCategory } from "@/lib/types";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, titleFr, description, descriptionFr, category, imageUrl } = body;

  if (!title || !description || !category || !imageUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const project = await createProject({
    title,
    titleFr,
    description,
    descriptionFr,
    category: category as ProjectCategory,
    imageUrl,
  });

  return NextResponse.json(project, { status: 201 });
}
