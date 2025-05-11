'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ViewPDF() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const router = useRouter();

 
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);


  const pdfContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const toolbarTimeoutRef = useRef(null);

 
  const updateContainerWidth = useCallback(() => {
    if (pdfContainerRef.current) {
      setContainerWidth(pdfContainerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, [updateContainerWidth]);

  
  const startAutoHideTimer = useCallback(() => {
    if (window.innerWidth < 768) {
      if (toolbarTimeoutRef.current) {
        clearTimeout(toolbarTimeoutRef.current);
      }
      toolbarTimeoutRef.current = setTimeout(() => {
        setIsToolbarVisible(false);
      }, 5000);
    }
  }, []);

  
  const toggleToolbar = () => {
    setIsToolbarVisible(prev => !prev);
    if (!isToolbarVisible) {
      startAutoHideTimer();
    }
  };

  
  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setLoading(false);
    setError(null);


    const pageParam = searchParams.get('page');
    if (pageParam && !isNaN(parseInt(pageParam)) && parseInt(pageParam) <= nextNumPages) {
      setPageNumber(parseInt(pageParam));
    }
  };


  const onDocumentLoadError = (error) => {
    setLoading(false);
    setError('Failed to load PDF. Please check the URL or try again.');
    console.error('PDF load error:', error);
  };

  
  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);

     
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', page);
      router.replace(`/view-pdf?${newSearchParams.toString()}`, { scroll: false });

    
      pdfContainerRef.current?.scrollIntoView({ behavior: 'smooth' });

   
      startAutoHideTimer();
    }
  };

 
  const handleSearch = async () => {
    if (!searchText || !numPages) return;

    setSearchResults([]);
    setCurrentSearchIndex(-1);

    try {
      const results = [];
      const pdf = await pdfjs.getDocument(url).promise;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        const searchRegex = new RegExp(searchText, 'gi');
        let match;

        while ((match = searchRegex.exec(text)) !== null) {
          results.push({
            pageNumber: i,
            text: match[0],
            position: match.index,
          });
        }
      }

      setSearchResults(results);
      if (results.length > 0) {
        setCurrentSearchIndex(0);
        goToPage(results[0].pageNumber);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    }

    startAutoHideTimer();
  };


  const goToNextResult = () => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(nextIndex);
    goToPage(searchResults[nextIndex].pageNumber);
    startAutoHideTimer();
  };

  const goToPrevResult = () => {
    if (searchResults.length === 0) return;
    const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentSearchIndex(prevIndex);
    goToPage(searchResults[prevIndex].pageNumber);
    startAutoHideTimer();
  };

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === searchInputRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPage(pageNumber - 1);
          break;
        case 'ArrowRight':
          goToPage(pageNumber + 1);
          break;
        case '+':
          setScale(prev => Math.min(prev + 0.1, 2.0));
          startAutoHideTimer();
          break;
        case '-':
          setScale(prev => Math.max(prev - 0.1, 0.5));
          startAutoHideTimer();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, startAutoHideTimer]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(e.target.pageInput.value);
    if (!isNaN(page)) {
      goToPage(page);
    }
  };

  if (!url) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Missing PDF URL</h2>
          <p className="text-gray-600">No PDF file URL provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <button
        onClick={toggleToolbar}
        className="md:hidden fixed top-4 right-4 z-20 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={isToolbarVisible ? "Hide toolbar" : "Show toolbar"}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isToolbarVisible ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div
        className={`sticky top-0 z-10 bg-white shadow-md transition-all duration-300 ${
          isToolbarVisible ? 'translate-y-0' : '-translate-y-full'
        } md:translate-y-0`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-gray-800">PDF Viewer</h2>

       
              {!loading && numPages && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={pageNumber === 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => goToPage(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <form onSubmit={handlePageSubmit} className="flex items-center">
                    <input
                      type="number"
                      name="pageInput"
                      min="1"
                      max={numPages}
                      defaultValue={pageNumber}
                      className="w-14 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span className="mx-1 text-gray-600">/ {numPages}</span>
                  </form>
                  <button
                    onClick={() => goToPage(pageNumber + 1)}
                    disabled={pageNumber >= numPages}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => goToPage(numPages)}
                    disabled={pageNumber === numPages}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last page"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M12.293 15.707a1 1 0 010-1.414L16.586 10l-4.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

           
            <div className="flex flex-1 md:justify-end items-center gap-3 flex-wrap">
              <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto">
                <div className="relative flex-grow">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search text..."
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-sm text-gray-500">
                      <span>{currentSearchIndex + 1}/{searchResults.length}</span>
                      <button
                        type="button"
                        onClick={goToPrevResult}
                        className="ml-1 p-1 hover:bg-gray-100 rounded"
                        title="Previous result"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={goToNextResult}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Next result"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </form>

      
              <div className="flex items-center">
                <button
                  onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
                  className="p-1 rounded hover:bg-gray-200"
                  title="Zoom out"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="mx-1 text-sm">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale(prev => Math.min(prev + 0.1, 2.0))}
                  className="p-1 rounded hover:bg-gray-200"
                  title="Zoom in"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <div ref={pdfContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex flex-col items-center"
              loading={
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                width={containerWidth * 0.95}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                className="border-b border-gray-200 pb-6 mb-6"
              />
            </Document>
          </div>
        )}
      </div>

   
      {!loading && numPages && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => goToPage(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Previous
                </button>
                <span>Page {pageNumber} / {numPages}</span>
              </div>
              <button
                onClick={() => goToPage(pageNumber + 1)}
                disabled={pageNumber >= numPages}
                className="px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <svg className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}