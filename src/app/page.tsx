export default function Home() {
  return (
    <div className="home-bg">
      <main className="home-main">
        <div className="home-content">
          <div className="home-center">
            <h2 className="home-title">
              Добро пожаловать в сервис бронирования
            </h2>
            <p className="home-desc">
              Найдите и забронируйте идеальную площадку для вашего мероприятия
            </p>
            <div className="home-btns">
              <div>
                <a
                  href="/venues"
                  className="btn btn-primary home-venues-btn"
                >
                  Смотреть площадки
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 