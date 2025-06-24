import { Blog } from "@/utils/types";
import { Card, CardContent } from "./ui/card";
import { formatDate } from "@/utils/utils";

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="w-full max-w-md mx-auto p-4 shadow-lg rounded-2xl">
      <CardContent className="space-y-2">
        <h2 className="text-xl font-semibold">{blog.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {blog.content.length > 30
            ? blog.content.slice(0, 30) + "..."
            : blog.content}
        </p>
        <div className="text-xs text-gray-500 flex justify-between pt-2">
          <span>By {blog.author_details?.name}</span>
          <span>
            {formatDate(blog?.created_at || new Date().toISOString())}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
