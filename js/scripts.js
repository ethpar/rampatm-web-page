/*!
 * Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener('DOMContentLoaded', (event) => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav')
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74
        })
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler')
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    )
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click()
            }
        })
    })

    // Contact form handler
    document
        .getElementById('contactForm')
        .addEventListener('submit', function (e) {
            e.preventDefault()

            const name = document.getElementById('name').value.trim()
            const email = document.getElementById('email').value.trim()
            const phone = document.getElementById('phone').value.trim()
            const message = document.getElementById('message').value.trim()

            const subject = encodeURIComponent('New Contact Form Submission')
            const body = encodeURIComponent(
                `Name: ${name}
Phone: ${phone}
Email: ${email}
Message:
${message}`
            )

            const to = 'info@rampatm.com'
            const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`

            // Show progress spinner on the submit button
            const submitBtn = document.getElementById('submitButton')
            const originalBtnText = submitBtn.innerHTML
            submitBtn.disabled = true
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Opening email app…'

            // Track whether the browser navigated away (mail client opened)
            let mailClientOpened = false

            const onBlur = () => {
                mailClientOpened = true
            }
            window.addEventListener('blur', onBlur)

            window.location.href = mailtoUrl

            // If the window hasn't lost focus after a short delay,
            // assume no mail client is available and show a fallback modal
            setTimeout(() => {
                window.removeEventListener('blur', onBlur)

                // Restore submit button
                submitBtn.disabled = false
                submitBtn.innerHTML = originalBtnText

                if (!mailClientOpened) {
                    // Dismiss the contact form modal first
                    const contactModalEl =
                        document.getElementById('feedbackModal')
                    const contactModal =
                        bootstrap.Modal.getInstance(contactModalEl)
                    if (contactModal) {
                        contactModal.hide()
                    }

                    // Wait for the contact modal to fully close before showing fallback
                    contactModalEl.addEventListener(
                        'hidden.bs.modal',
                        function showFallback() {
                            contactModalEl.removeEventListener(
                                'hidden.bs.modal',
                                showFallback
                            )
                            const fallbackModal = new bootstrap.Modal(
                                document.getElementById('mailFallbackModal')
                            )
                            fallbackModal.show()
                        }
                    )
                }
            }, 1500)
        })

    // Copy email address button in fallback modal
    const copyEmailBtn = document.getElementById('copyEmailBtn')
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function () {
            navigator.clipboard
                .writeText('info@rampatm.com')
                .then(() => {
                    copyEmailBtn.textContent = 'Copied!'
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'Copy Email Address'
                    }, 2000)
                })
                .catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea')
                    textarea.value = 'info@rampatm.com'
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                    copyEmailBtn.textContent = 'Copied!'
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'Copy Email Address'
                    }, 2000)
                })
        })
    }
})
