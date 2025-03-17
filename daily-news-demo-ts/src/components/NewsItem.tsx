import { format, setDefaultOptions } from "date-fns";
import { th } from "date-fns/locale";
interface NewsItemProps {
  article: {
    Date: string;
    Link: string;
    Image: string;
    Title: string;
    Content: string;
    SourceLink: string;
    SourceImage: string;
  };
  truncateText: (text: string, length: number) => string;
}

setDefaultOptions({ locale: th });

const NewsItem = ({ article, truncateText }: NewsItemProps) => {
  const formattedDate = format(new Date(), "dd MMM yyyy");
  return (
    <li className="mb-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
        <a href={article.Link} target="_blank" rel="noopener noreferrer">
          <div className="flex justify-center">
            <img
              src={article.Image}
              alt={article.Title}
              className="w-full h-[700px] object-cover transition-transform duration-300 transform hover:scale-110"
            />
          </div>
        </a>

        <div className="p-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{article.Title}</h2>
          <p className="text-gray-800">{truncateText(article.Content, 200)}</p>
          {article.Content.length > 150 && (
            <a
              href={article.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-2"
            >
              อ่านเพิ่มเติม
            </a>
          )}

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">ลงไว้เมื่อวันที่ : {formattedDate}</p>
            <a href={article.SourceLink} target="_blank" rel="noopener noreferrer">
              <img
                src={article.SourceImage}
                alt="Source"
                className="w-12 h-12 object-cover rounded-full border-2 border-gray-300"
              />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

export default NewsItem;
