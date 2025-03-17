"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import NewsItem from "../components/NewsItem";
import mockNews from "../data/mockNews.json";

interface Article {
  Id: number;
  Date: string;
  Link: string;
  Image: string;
  Title: string;
  Content: string;
  SourceLink: string;
  SourceImage: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(mockNews as Article[]);
  }, []);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "... ";
    }
    return text;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Daily News</h1>
      <ul>
        {articles.map((article) => (
          <NewsItem key={article.Id} article={article} truncateText={truncateText} />
        ))}
      </ul>
      <Footer />
    </div>
  );
}