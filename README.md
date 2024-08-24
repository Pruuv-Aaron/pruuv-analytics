# Pruuv Analytics

## Installation
    npm install pruuv-analytics

## Usage
    import PruuvAnalytics from 'pruuv-analytics';

    const paClient = new PruuvAnalytics('api-key', 'funnel-id')

    paClient.pageView({ additionalCustomContext: 'This is a custom context value from you!' })
