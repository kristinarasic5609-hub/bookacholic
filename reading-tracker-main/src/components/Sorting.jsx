import React from 'react';

const Sorting = ({ sortBy, sortOrder, onSortChange, options = [] }) => {
    const defaultOptions = [
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' },
        { value: 'year', label: 'Year' },
        { value: 'rating', label: 'Rating' },
        { value: 'pages', label: 'Pages' },
        ...options
    ];

    return (
        <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>

            <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                {defaultOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <button
                onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
        </div>
    );
};

export default Sorting;

