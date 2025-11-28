import apiClient from './authService'

export const systemService = {
    // Health Checks
    getHealth: () => apiClient.get('/health'),
    getReadiness: () => apiClient.get('/health/ready'),
    getLiveness: () => apiClient.get('/health/live'),

    // Email Testing
    getEmailHealth: () => apiClient.get('/v1/email-test/health'),
    sendTestEmail: (to: string, subject: string, html: string) =>
        apiClient.post('/v1/email-test/send', { to, subject, html }),

    // Sentry Testing
    getSentryStatus: () => apiClient.get('/sentry-test/status'),
    triggerSentryError: () => apiClient.post('/sentry-test/test-error'),
    triggerSentryTransaction: () => apiClient.post('/sentry-test/test-transaction'),
}

export default systemService
