import React from 'react';
import { ArticlesList } from '../components/ArticlesList';
import { CommentsByPost } from '../components/CommentsByPost';
import { SearchPhotos } from '../components/SearchPhotos';
import { UserProfileComplete } from '../components/UserProfileComplete';
import { CrudDemo } from '../components/CrudDemo';
import { FileUploadSimulator } from '../components/FileUploadSimulator';
import './Lab7Page.css';

export default function Lab7Page() {
  return (
    <div className="lab-page">
      <header className="lab-header">
        <h1 className="lab-title">USE EFFECT</h1>
        <p className="lab-subtitle">Асинхронні операції, API, AbortController</p>
      </header>

      <main className="lab-main">
        <ArticlesList />
        <CommentsByPost />
        <SearchPhotos />
        <UserProfileComplete />
        <CrudDemo />
        <FileUploadSimulator />
      </main>
    </div>
  );
}
