document.addEventListener('DOMContentLoaded', function() {
    // 부드러운 스크롤 애니메이션
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 프로젝트 필터링 기능
    const setupProjectFilters = () => {
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;

        const projects = document.querySelectorAll('.project-card');
        const tags = new Set();

        // 모든 고유 태그 수집
        projects.forEach(project => {
            const projectTags = project.querySelectorAll('.tag');
            projectTags.forEach(tag => {
                tags.add(tag.textContent.trim());
            });
        });

        // 필터 버튼 생성
        const allButton = document.createElement('button');
        allButton.textContent = '전체';
        allButton.classList.add('filter-btn', 'active');
        filterContainer.appendChild(allButton);

        // 태그를 알파벳 순으로 정렬하여 버튼 생성
        Array.from(tags).sort().forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.classList.add('filter-btn');
            filterContainer.appendChild(button);
        });

        // 필터 기능 추가
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 모든 버튼에서 active 클래스 제거
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 현재 버튼에 active 클래스 추가
                button.classList.add('active');

                const filter = button.textContent;

                projects.forEach(project => {
                    if (filter === '전체') {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                        return;
                    }

                    const projectTags = Array.from(project.querySelectorAll('.tag'))
                        .map(tag => tag.textContent.trim());

                    if (projectTags.includes(filter)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    };

    // 프로젝트 필터링 설정
    if (document.querySelector('.filter-container')) {
        setupProjectFilters();
    }

    // 스크롤 시 나타나는 애니메이션
    const handleScrollAnimation = () => {
        const sections = document.querySelectorAll('.section, .timeline-item, .project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            if (!section.classList.contains('fade-in')) {
                section.style.opacity = '0';
                observer.observe(section);
            }
        });
    };
    
    // IntersectionObserver가 지원되는 브라우저에서만 스크롤 애니메이션 활성화
    if ('IntersectionObserver' in window) {
        // 초기에 보이는 요소들에 대한 페이드인 적용
        setTimeout(() => {
            handleScrollAnimation();
        }, 100);
    } else {
        // 지원되지 않는 브라우저에서는 모든 요소 표시
        document.querySelectorAll('.section, .timeline-item, .project-card').forEach(el => {
            el.classList.add('fade-in');
        });
    }

    // 맨 위로 스크롤 버튼
    const createScrollTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.classList.add('scroll-top-btn');
        button.style.display = 'none';
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createScrollTopButton();

    // 이미지 모달 기능
    const setupImageModal = () => {
        const profileImage = document.querySelector('.profile-image img');
        
        if (!profileImage) return;

        // 모달 요소 생성
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        
        const modalContent = document.createElement('img');
        modalContent.classList.add('modal-content');
        
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('close-modal');
        closeBtn.innerHTML = '&times;';
        
        modal.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 이미지 클릭 이벤트 추가
        profileImage.style.cursor = 'pointer';
        profileImage.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalContent.src = profileImage.src;
        });
        
        // 닫기 버튼이나 모달 외부 클릭 시 모달 닫기
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    setupImageModal();

    // 다크모드 토글 (옵션)
    const setupDarkModeToggle = () => {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '🌙';
        themeToggle.classList.add('theme-toggle');
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            
            // 환경설정 저장
            localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
        });

        // 저장된 환경설정 확인
        if (localStorage.getItem('dark-mode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        }
    };

    // 다크모드 토글 활성화
    setupDarkModeToggle();

    // 현재 연도 표시
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // 마우스 호버 효과 개선
    const enhanceHoverEffects = () => {
        const cards = document.querySelectorAll('.project-card, .timeline-item, .certificate-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });
        });
    };
    
    enhanceHoverEffects();
});
