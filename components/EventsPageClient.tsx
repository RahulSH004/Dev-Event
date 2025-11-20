'use client';

import { useState, useEffect, useCallback } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import Filters from './Filters';
import Pagination from './Pagination';
import { IEvent } from '@/database';

export default function EventsPageClient() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (date) params.append('date', date);
      if (mode) params.append('mode', mode);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch events:', data.message);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, date, mode, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setDate('');
    setMode('');
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="events-page">
      <div className="events-page-header">
        <h1>All Events</h1>
        <p className="text-light-100">
          Discover hackathons, meetups, and conferences
        </p>
      </div>

      <SearchBar onSearch={handleSearchChange} />

      <Filters
        date={date}
        mode={mode}
        onDateChange={(value) => {
          setDate(value);
          setCurrentPage(1);
        }}
        onModeChange={(value) => {
          setMode(value);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
      />

      <div className="events-results">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="events-count">
              <p className="text-light-200">
                Showing {events.length} of {pagination.total} events
              </p>
            </div>
            <ul className="events">
              {events.map((event: IEvent) => (
                <li key={String(event._id)} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>No events found matching your criteria.</p>
            {(searchQuery || date || mode) && (
              <button onClick={handleClearFilters} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
