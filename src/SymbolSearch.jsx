import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';

function SymbolSearch({ onSelect }) {
    const loadOptions = async (inputValue) => {
    if (!inputValue) return [];
        const resp = await fetch(
            `https://financialmodelingprep.com/api/v3/search?query=${inputValue}&limit=10&exchange=NASDAQ&apikey=5DoRZTsCY0JdOkmZsiufn2HnhXdlsd5x`
    );
    const json = await resp.json();
    return json.map(item => ({
        label: `${item.symbol} — ${item.name}`,
        value: item.symbol
    }));
    };

    return (
        <AsyncSelect styles={{ menu: provided => ({ ...provided, zIndex: 9999 , color: 'black' }) }}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            onChange={option => onSelect(option.value)}
            placeholder="Search symbol or company..."
        />
    );
}
export default SymbolSearch;
