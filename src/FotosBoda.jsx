import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FotosBoda() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingFiles, setUploadingFiles] = useState({});
    const [nextPageToken, setNextPageToken] = useState(null);
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const fileInputRef = useRef(null);

    const fetchFiles = async (pageToken = '') => {
        try {
            setLoading(true);
            const url = `/api/drive-list${pageToken ? `?pageToken=${pageToken}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error fetching gallery');
            const data = await res.json();
            
            setFiles(prev => pageToken ? [...prev, ...data.files] : data.files);
            setNextPageToken(data.nextPageToken);
        } catch (err) {
            console.error(err);
            // Ignore error for now, could show a toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        handleUploads(selectedFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length === 0) return;
        handleUploads(droppedFiles);
    };

    const handleUploads = async (filesToUpload) => {
        for (const file of filesToUpload) {
            const tempId = Math.random().toString(36).substring(7);
            setUploadingFiles(prev => ({
                ...prev,
                [tempId]: { name: file.name, progress: 0 }
            }));

            try {
                // 1. Get Resumable Upload URI
                const initRes = await fetch('/api/drive-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: file.name,
                        mimeType: file.type,
                        size: file.size
                    })
                });
                
                if (!initRes.ok) throw new Error('Error init upload');
                const { uploadUrl, fileId } = await initRes.json();

                // 2. Upload directly via XHR to track progress
                const uploadedFileId = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', uploadUrl);
                    
                    xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                            const percent = Math.round((e.loaded / e.total) * 100);
                            setUploadingFiles(prev => ({
                                ...prev,
                                [tempId]: { ...prev[tempId], progress: percent }
                            }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            // Google's resumable upload returns the file metadata as JSON
                            try {
                                const fileData = JSON.parse(xhr.responseText);
                                resolve(fileData.id || null);
                            } catch {
                                resolve(null);
                            }
                        } else if (xhr.status === 0) {
                            resolve(null);
                        } else {
                            reject(new Error('Upload failed'));
                        }
                    };
                    
                    xhr.onerror = () => {
                        resolve(null);
                    };
                    xhr.send(file);
                });

                // 3. Make the file publicly accessible so videos can stream directly
                if (uploadedFileId) {
                    try {
                        await fetch('/api/drive-permissions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fileId: uploadedFileId })
                        });
                    } catch (permErr) {
                        console.warn('Could not set public permissions:', permErr);
                    }
                }

                // Success, remove from uploading and refresh gallery
                setUploadingFiles(prev => {
                    const next = { ...prev };
                    delete next[tempId];
                    return next;
                });
                
                // Fetch fresh list to see the new file
                fetchFiles();
                
            } catch (err) {
                console.error(`Error uploading ${file.name}:`, err);
                setUploadingFiles(prev => ({
                    ...prev,
                    [tempId]: { ...prev[tempId], progress: -1 } // -1 means error
                }));
            }
        }
    };

    const openLightbox = (index) => {
        setLightboxMedia({ index, ...files[index] });
    };

    const navigateLightbox = (dir) => {
        if (!lightboxMedia) return;
        let newIndex = lightboxMedia.index + dir;
        if (newIndex < 0) newIndex = files.length - 1;
        if (newIndex >= files.length) newIndex = 0;
        setLightboxMedia({ index: newIndex, ...files[newIndex] });
    };

    return (
        <div className="gallery-container">
            <header className="gallery-header">
                <h1>Victoria & Pedro</h1>
                <p>Nuestros Recuerdos</p>
            </header>

            <div 
                className="upload-area"
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <span className="upload-icon">📸</span>
                <h3>Sube tus fotos y vídeos</h3>
                <p style={{ marginTop: '0.5rem', color: '#a0aec0' }}>Toca aquí o arrastra archivos</p>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    multiple 
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                />
                <button className="upload-btn">Seleccionar archivos</button>
            </div>

            {Object.keys(uploadingFiles).length > 0 && (
                <div className="upload-progress-container">
                    {Object.entries(uploadingFiles).map(([id, data]) => (
                        <div key={id} className="progress-item">
                            <div className="progress-header">
                                <span>{data.name}</span>
                                <span>{data.progress === -1 ? 'Error' : `${data.progress}%`}</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ 
                                        width: `${data.progress === -1 ? 100 : data.progress}%`,
                                        background: data.progress === -1 ? 'var(--color-error)' : 'var(--color-secondary)'
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {loading && files.length === 0 ? (
                <div className="loader"></div>
            ) : files.length === 0 ? (
                <div className="no-files">
                    <p>Aún no hay fotos ni vídeos. ¡Sé el primero en subir algo!</p>
                </div>
            ) : (
                <div className="masonry-grid">
                    {files.map((file, index) => {
                        const isVideo = file.mimeType.includes('video');
                        // Google Drive's thumbnailLink expires and blocks hotlinking.
                        // drive.google.com/thumbnail provides a stable redirect, and referrerPolicy bypasses the hotlink blocker.
                        const imgSrc = `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`;

                        return (
                            <motion.div 
                                key={file.id} 
                                className="masonry-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                onClick={() => openLightbox(index)}
                            >
                                <img 
                                    src={imgSrc} 
                                    alt={file.name} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        if (e.target.src !== file.iconLink) {
                                            e.target.src = file.iconLink;
                                            e.target.style.objectFit = 'contain';
                                            e.target.style.padding = '2rem';
                                        }
                                    }}
                                />
                                {isVideo && (
                                    <div className="play-icon">▶</div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {nextPageToken && (
                <button 
                    className="secondary-button" 
                    style={{ marginTop: '2rem' }}
                    onClick={() => fetchFiles(nextPageToken)}
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Ver más'}
                </button>
            )}

            <AnimatePresence>
                {lightboxMedia && (
                    <motion.div 
                        className="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxMedia(null)}
                    >
                        <button className="close-btn" onClick={() => setLightboxMedia(null)}>✕</button>
                        <button className="nav-btn nav-prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>‹</button>
                        <button className="nav-btn nav-next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}>›</button>
                        
                        <div className="lightbox-content-wrapper" onClick={e => e.stopPropagation()}>
                            {lightboxMedia.mimeType.includes('video') ? (
                                <video 
                                    className="lightbox-content" 
                                    src={`/api/drive-video?id=${lightboxMedia.id}`}
                                    controls
                                    autoPlay
                                    playsInline
                                    style={{ maxHeight: '85vh', maxWidth: '95vw', objectFit: 'contain', background: '#000' }}
                                />
                            ) : (
                                <img 
                                    className="lightbox-content" 
                                    src={`https://drive.google.com/thumbnail?id=${lightboxMedia.id}&sz=w1600`} 
                                    alt={lightboxMedia.name} 
                                    referrerPolicy="no-referrer"
                                    style={{ maxHeight: '85vh', maxWidth: '95vw', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
