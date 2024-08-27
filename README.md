# Pruuv Analytics

## Installation
    npm install pruuv-analytics

## Usage
    import PruuvAnalyticsClient from 'pruuv-analytics';

    const paClient = new PruuvAnalyticsClient('api-key', 'funnel-id')

    // Event name options: 'page-view' or 'clicked'
    paClient.event(<event_name/>, { additionalCustomContext: 'This is a custom context value from you!' })
