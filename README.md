# Pruuv Analytics

## Installation
    npm install pruuv-analytics

## Usage
    import PruuvAnalyticsClient from 'pruuv-analytics';

    const paClient = new PruuvAnalyticsClient('api-key', 'funnel-id')

    paClient.page({ additionalCustomContext: 'This is a custom context value from you!' })
