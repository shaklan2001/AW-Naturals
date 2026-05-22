import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminImageUploadField } from "@/components/forms/AdminImageUploadField";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { slugify, formatDate } from "@/utils/cn";
import type { CreateBlogInput } from "@/api/admin-api";
import { useAdminBlog, useCreateBlog, useUpdateBlog } from "@/hooks/use-admin-queries";

const FALLBACK_COVER = "https://placehold.co/800x400/e2e8f0/64748b?text=Post";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  author: z.string().min(2, "Author required"),
  category: z.string().min(1, "Category required"),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["published", "draft"]),
  content: z.string().min(1, "Content is required"),
});

type FormValues = z.infer<typeof schema>;

const defaultNew: FormValues = {
  title: "",
  slug: "",
  author: "",
  category: "",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  status: "draft",
  content: "",
};

export function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const blogQ = useAdminBlog(id, { enabled: !isNew });
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [preview, setPreview] = useState(false);

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultNew,
    });

  const title = watch("title");
  const content = watch("content");
  const coverImage = watch("coverImage");

  useEffect(() => {
    if (blogQ.data) {
      reset({
        title: blogQ.data.title,
        slug: blogQ.data.slug,
        author: blogQ.data.author,
        category: blogQ.data.category,
        coverImage: blogQ.data.coverImage,
        seoTitle: blogQ.data.seoTitle,
        seoDescription: blogQ.data.seoDescription,
        status: blogQ.data.status,
        content: blogQ.data.content,
      });
    }
  }, [blogQ.data, reset]);

  useEffect(() => {
    if (isNew) {
      setValue("slug", slugify(title ?? ""));
    }
  }, [title, isNew, setValue]);

  const onSubmit = async (data: FormValues) => {
    const cover = data.coverImage?.trim() || FALLBACK_COVER;
    const payload: CreateBlogInput = {
      title: data.title,
      slug: data.slug,
      author: data.author,
      category: data.category,
      coverImage: cover,
      content: data.content,
      seoTitle: (data.seoTitle?.trim() || data.title).slice(0, 200),
      seoDescription: (data.seoDescription?.trim() || data.title).slice(0, 300),
      status: data.status,
    };
    try {
      if (id) {
        await updateBlog.mutateAsync({ id, body: payload });
      } else {
        await createBlog.mutateAsync(payload);
      }
      navigate("/blog");
    } catch {
      /* optional error UI */
    }
  };

  const existing = blogQ.data;
  const saving = createBlog.isPending || updateBlog.isPending;

  if (!isNew && blogQ.isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-24 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading post…
      </div>
    );
  }

  if (!isNew && blogQ.isError) {
    return (
      <div className="space-y-4 text-center py-16">
        <p className="text-red-600 text-sm">{blogQ.error.message}</p>
        <Button variant="outline" onClick={() => navigate("/blog")}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/blog")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight text-[#212b36]">
            {isNew ? "New blog post" : "Edit post"}
          </h2>
          {existing && (
            <p className="text-xs text-[#919eab]">Last updated {formatDate(existing.updatedAt)}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreview((p) => !p)}>
            {preview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" /> Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" /> Preview
              </>
            )}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Post
              </>
            )}
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {(coverImage || "").trim() && (
            <img
              src={(coverImage || "").trim() || FALLBACK_COVER}
              alt="Cover"
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_COVER;
              }}
            />
          )}
          <div className="p-8">
            <Badge variant="outline" className="mb-4">
              {watch("category") || "Category"}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {watch("title") || "Blog Title"}
            </h1>
            <div className="flex items-center gap-3 mt-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                {(watch("author") || "A")[0]}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{watch("author") || "Author"}</div>
                <div className="text-xs text-gray-400">
                  {existing
                    ? formatDate(existing.createdAt)
                    : new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                </div>
              </div>
            </div>
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{
                __html: content || "<p>Start writing to see preview...</p>",
              }}
            />
          </div>
        </div>
      ) : (
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-5" onSubmit={(e) => e.preventDefault()}>
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Title *</Label>
                  <Input {...register("title")} placeholder="Enter post title..." className="text-lg font-medium" />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Slug *</Label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">/blog/</span>
                    <Input {...register("slug")} placeholder="post-slug" className="font-mono text-sm" />
                  </div>
                  {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Content *</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <TipTapEditor content={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <Button type="button" className="w-full" disabled={saving} onClick={handleSubmit(onSubmit)}>
                  <Save className="w-4 h-4 mr-2" /> {isNew ? "Publish Post" : "Update Post"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>Author</Label>
                  <Input {...register("author")} placeholder="Author name" />
                  {errors.author && <p className="text-xs text-red-500">{errors.author.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input {...register("category")} placeholder="e.g. Wellness" />
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Cover image (optional)</Label>
                  <AdminImageUploadField
                    value={coverImage ?? ""}
                    onUrlChange={(url) => setValue("coverImage", url, { shouldDirty: true })}
                    disabled={saving}
                  />
                  <Input {...register("coverImage")} placeholder="https://... (or upload above)" />
                  {coverImage?.trim() && (
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="rounded-lg w-full h-28 object-cover mt-2"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>SEO Title</Label>
                  <Input {...register("seoTitle")} placeholder="SEO optimized title" />
                </div>
                <div className="space-y-1">
                  <Label>SEO Description</Label>
                  <Textarea {...register("seoDescription")} placeholder="Meta description" rows={3} />
                  <p className="text-xs text-gray-400">{(watch("seoDescription") ?? "").length}/160 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      )}
    </div>
  );
}
