'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { useSession } from '@/lib/auth-client';
import { IEvent } from '@/database';
import Link from 'next/link';
import Image from 'next/image';

interface EventFormProps {
  event?: IEvent;
  isEdit?: boolean;
}

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event?.image || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'events');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('You must be signed in to create an event');
      return;
    }

    // Check if image is required for new events
    if (!isEdit && !imageFile && !imagePreview) {
      setError('Please select an image for the event');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = event?.image || '';

      // Upload image if a new file is selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadToCloudinary(imageFile);
        setUploadingImage(false);
      }

      // Get form data directly from form elements
      const form = formRef.current;
      if (!form) {
        setError('Form reference not found');
        return;
      }

      const formElements = form.elements as any;

      const eventData = {
        title: formElements.title?.value || '',
        description: formElements.description?.value || '',
        slug: formElements.slug?.value || '',
        date: formElements.date?.value || '',
        time: formElements.time?.value || '',
        venue: formElements.venue?.value || '',
        location: formElements.location?.value || '',
        image: imageUrl,
        mode: formElements.mode?.value || 'online',
        overview: formElements.overview?.value || '',
        organizer: formElements.organizer?.value || '',
        tags: formElements.tags?.value?.split(',').map((tag: string) => tag.trim()) || [],
        agenda: formElements.agenda?.value?.split(',').map((item: string) => item.trim()) || [],
        audience: formElements.audience?.value || '',
      };

      if (isEdit && event?._id) {
        await updateEvent(event._id.toString(), eventData, session.user.id);
        alert('Event updated successfully!');
      } else {
        await createEvent(eventData, session.user.id);
        alert('Event created successfully!');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving event:', error);
      setError(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  if (isPending) {
    return (
      <div className="loading-spinner"></div>
    );
  }

  if (!session) {
    return (
      <div className="empty-state">
        <p>You must be signed in to {isEdit ? 'edit' : 'create'} events.</p>
        <Link href="/auth/signin" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="event-form">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={event?.title}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Event Slug *</label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={event?.slug}
            required
            placeholder="event-slug-url"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            defaultValue={event?.description}
            required
            placeholder="Brief description of the event"
            rows={2}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="overview">Overview *</label>
          <textarea
            id="overview"
            name="overview"
            defaultValue={event?.overview}
            required
            placeholder="Detailed overview of the event"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue *</label>
          <input
            id="venue"
            name="venue"
            type="text"
            defaultValue={event?.venue}
            required
            placeholder="Venue name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={event?.location}
            required
            placeholder="City, Country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={event?.date}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time *</label>
          <input
            id="time"
            name="time"
            type="time"
            defaultValue={event?.time}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="image">Event Image *</label>
          <div className="image-upload-container">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={200}
                  height={150}
                  className="preview-img"
                  unoptimized={imagePreview.startsWith('data:')}
                />
              </div>
            )}
          </div>
          {uploadingImage && <p className="upload-status">Uploading image...</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mode">Mode *</label>
          <select
            id="mode"
            name="mode"
            defaultValue={event?.mode || 'online'}
            required
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="audience">Target Audience *</label>
          <input
            id="audience"
            name="audience"
            type="text"
            defaultValue={event?.audience}
            required
            placeholder="e.g., Developers, Students"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="organizer">Organizer *</label>
          <input
            id="organizer"
            name="organizer"
            type="text"
            defaultValue={event?.organizer}
            required
            placeholder="Organization or person name"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="tags">Tags (comma-separated) *</label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={event?.tags?.join(', ')}
            required
            placeholder="React, JavaScript, Web Development"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="agenda">Agenda (comma-separated) *</label>
          <textarea
            id="agenda"
            name="agenda"
            defaultValue={event?.agenda?.join(', ')}
            required
            placeholder="Introduction, Main Session, Q&A Session"
            rows={2}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
