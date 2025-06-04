export function statusTranslate() {
  const statusMapping: { [key: string]: string } = {
    "На рассмотрении": "draft",
    "Удалён": "deleted",
    "Сформирован": "formatted",
    "Завершён": "completed",
    "Отклонён": "rejected"
  };

  const reverseStatusMapping: { [key: string]: string } = Object.fromEntries(
    Object.entries(statusMapping).map(([russian, english]) => [english, russian])
  );

  const getStatus = (status: string) => {
    // Проверяем, если статус на русском
    if (statusMapping[status]) {
      return statusMapping[status]; // Возвращаем английский
    }

    // Если не нашли в русском статусе, ищем в английском
    if (reverseStatusMapping[status]) {
      return reverseStatusMapping[status]; // Возвращаем русский
    }

    // Если статус не найден, возвращаем его как есть
    return status;
  };

  return {
    statusMapping,
    getStatus
  };
}
