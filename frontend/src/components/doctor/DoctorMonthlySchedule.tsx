import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import BlockIcon from "@mui/icons-material/Block";

import dayjs, { type Dayjs } from "dayjs";

import "dayjs/locale/vi";

import type { BlockedSlot, DoctorSchedule } from "../../types/schedule";

import {
  getMyBlockedSlots,
  getMyDoctorSchedules,
} from "../../services/doctorScheduleService";

dayjs.locale("vi");

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const fixedHolidays: Record<string, string> = {
  "01-01": "Tết Dương lịch",

  "04-30": "Ngày Giải phóng miền Nam",

  "05-01": "Ngày Quốc tế Lao động",

  "09-02": "Ngày Quốc khánh",
};

const specialHolidays: Record<string, string> = {
  /*
   * Ví dụ:
   *
   * "2026-02-17":
   *   "Tết Nguyên Đán",
   */
};

function getHolidayName(date: Dayjs): string | null {
  const fullDate = date.format("YYYY-MM-DD");

  if (specialHolidays[fullDate]) {
    return specialHolidays[fullDate];
  }

  const monthDay = date.format("MM-DD");

  if (fixedHolidays[monthDay]) {
    return fixedHolidays[monthDay];
  }

  return null;
}

function DoctorMonthlySchedule() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      setError("");

      const [scheduleResponse, blockedResponse] = await Promise.all([
        getMyDoctorSchedules(),
        getMyBlockedSlots(),
      ]);

      setSchedules(scheduleResponse.data);

      setBlockedSlots(blockedResponse.data);
    } catch (error) {
      console.error("Load monthly schedule error:", error);

      setError("Không thể tải lịch làm việc theo tháng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.isActive);
  }, [schedules]);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");

    const endOfMonth = currentMonth.endOf("month");

    const firstDay = startOfMonth.day();

    const daysBefore = firstDay === 0 ? 6 : firstDay - 1;

    const calendarStart = startOfMonth.subtract(daysBefore, "day");

    const lastDay = endOfMonth.day();

    const daysAfter = lastDay === 0 ? 0 : 7 - lastDay;

    const calendarEnd = endOfMonth.add(daysAfter, "day");

    const days: Dayjs[] = [];

    let currentDay = calendarStart;

    while (
      currentDay.isBefore(calendarEnd, "day") ||
      currentDay.isSame(calendarEnd, "day")
    ) {
      days.push(currentDay);

      currentDay = currentDay.add(1, "day");
    }

    return days;
  }, [currentMonth]);

  const getSchedulesForDay = (date: Dayjs) => {
    return activeSchedules
      .filter((schedule) => schedule.dayOfWeek === date.day())
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getBlockedSlotsForDay = (date: Dayjs) => {
    return blockedSlots
      .filter((blockedSlot) => dayjs(blockedSlot.startAt).isSame(date, "day"))
      .sort((a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf());
  };

  const isWholeWorkingDayBlocked = (
    date: Dayjs,
    daySchedules: DoctorSchedule[],
    dayBlockedSlots: BlockedSlot[],
  ) => {
    if (daySchedules.length === 0 || dayBlockedSlots.length === 0) {
      return false;
    }

    const sortedSchedules = [...daySchedules].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    const firstSchedule = sortedSchedules[0];

    const lastSchedule = [...sortedSchedules].sort((a, b) =>
      b.endTime.localeCompare(a.endTime),
    )[0];

    if (!firstSchedule || !lastSchedule) {
      return false;
    }

    const workingStart = dayjs(
      `${date.format("YYYY-MM-DD")}T${firstSchedule.startTime}`,
    );

    const workingEnd = dayjs(
      `${date.format("YYYY-MM-DD")}T${lastSchedule.endTime}`,
    );

    return dayBlockedSlots.some((blockedSlot) => {
      const blockStart = dayjs(blockedSlot.startAt);

      const blockEnd = dayjs(blockedSlot.endAt);

      const startsBeforeOrAt =
        blockStart.isBefore(workingStart) || blockStart.isSame(workingStart);

      const endsAfterOrAt =
        blockEnd.isAfter(workingEnd) || blockEnd.isSame(workingEnd);

      return startsBeforeOrAt && endsAfterOrAt;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((previous) => previous.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((previous) => previous.add(1, "month"));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(dayjs().startOf("month"));
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          justifyContent: "space-between",

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,

              mb: 0.5,
            }}
          >
            Lịch làm việc theo tháng
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Xem lịch làm việc, ngày nghỉ lễ và thời gian nghỉ đột xuất.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={handlePreviousMonth} aria-label="Tháng trước">
            <ChevronLeftIcon />
          </IconButton>

          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={handleCurrentMonth}
            sx={{
              textTransform: "none",
            }}
          >
            Tháng hiện tại
          </Button>

          <IconButton onClick={handleNextMonth} aria-label="Tháng sau">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

          mb: 2,

          borderRadius: 3,

          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Tháng {currentMonth.format("MM/YYYY")}
        </Typography>
      </Paper>

      <Box
        sx={{
          overflowX: "auto",

          pb: 1,
        }}
      >
        <Box
          sx={{
            minWidth: 950,
          }}
        >
          {/* HEADER THỨ */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: "repeat(7, 1fr)",

              gap: 1,

              mb: 1,
            }}
          >
            {weekDays.map((day, index) => {
              const isWeekend = index === 5 || index === 6;

              return (
                <Paper
                  key={day}
                  variant="outlined"
                  sx={{
                    py: 1.5,

                    textAlign: "center",

                    borderRadius: 2,

                    bgcolor: isWeekend ? "#fff8f8" : "background.paper",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,

                      color: isWeekend ? "error.main" : "text.primary",
                    }}
                  >
                    {day}
                  </Typography>
                </Paper>
              );
            })}
          </Box>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: "repeat(7, 1fr)",

              gap: 1,
            }}
          >
            {calendarDays.map((date) => {
              const isCurrentMonth = date.month() === currentMonth.month();

              const isToday = date.isSame(dayjs(), "day");

              const isWeekend = date.day() === 6 || date.day() === 0;

              const holidayName = getHolidayName(date);

              const isHoliday = !!holidayName;

              const daySchedules = getSchedulesForDay(date);

              const dayBlockedSlots = getBlockedSlotsForDay(date);

              const hasBlockedSlots = dayBlockedSlots.length > 0;

              const wholeDayBlocked = isWholeWorkingDayBlocked(
                date,
                daySchedules,
                dayBlockedSlots,
              );

              let backgroundColor: string = "background.paper";

              if (isHoliday) {
                backgroundColor = "#fff1f1";
              } else if (wholeDayBlocked) {
                backgroundColor = "#fff3e0";
              } else if (hasBlockedSlots) {
                backgroundColor = "#fffaf0";
              } else if (isWeekend) {
                backgroundColor = "#fff8f8";
              } else if (isToday) {
                backgroundColor = "action.hover";
              }

              return (
                <Paper
                  key={date.format("YYYY-MM-DD")}
                  variant="outlined"
                  sx={{
                    minHeight: 190,

                    p: 1.2,

                    borderRadius: 2,

                    opacity: isCurrentMonth ? 1 : 0.4,

                    bgcolor: backgroundColor,

                    borderColor: isToday
                      ? "primary.main"
                      : isHoliday
                        ? "error.main"
                        : hasBlockedSlots
                          ? "warning.main"
                          : "divider",

                    borderWidth:
                      isToday || isHoliday || hasBlockedSlots ? 2 : 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",

                      justifyContent: "space-between",

                      alignItems: "flex-start",

                      gap: 0.5,

                      mb: 1,

                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,

                        fontSize: 16,

                        color:
                          isHoliday || isWeekend
                            ? "error.main"
                            : isToday
                              ? "primary.main"
                              : "text.primary",
                      }}
                    >
                      {date.format("DD")}
                    </Typography>

                    {isToday && (
                      <Chip label="Hôm nay" size="small" color="primary" />
                    )}
                  </Box>

                  {isHoliday && (
                    <Box
                      sx={{
                        mb: 1,
                      }}
                    >
                      <Chip
                        label="Nghỉ lễ"
                        color="error"
                        size="small"
                        sx={{
                          mb: 0.5,
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          color: "error.main",

                          fontWeight: 600,

                          lineHeight: 1.3,
                        }}
                      >
                        {holidayName}
                      </Typography>
                    </Box>
                  )}

                  {!isHoliday && wholeDayBlocked && (
                    <Box
                      sx={{
                        mb: 1,
                      }}
                    >
                      <Chip
                        icon={<BlockIcon />}
                        label="Nghỉ đột xuất"
                        color="warning"
                        size="small"
                        sx={{
                          mb: 0.5,
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",

                          fontWeight: 700,

                          color: "warning.dark",
                        }}
                      >
                        Nghỉ cả ca làm việc
                      </Typography>
                    </Box>
                  )}

                  {!isHoliday &&
                    !wholeDayBlocked &&
                    (daySchedules.length === 0 ? (
                      <Typography
                        variant="caption"
                        sx={{
                          color: isWeekend ? "error.main" : "text.disabled",

                          fontWeight: isWeekend ? 600 : 400,

                          display: "block",

                          mb: 1,
                        }}
                      >
                        Nghỉ
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",

                          flexDirection: "column",

                          gap: 0.7,

                          mb: hasBlockedSlots ? 1 : 0,
                        }}
                      >
                        {daySchedules.map((schedule) => (
                          <Box
                            key={schedule.id}
                            sx={{
                              p: 0.8,

                              borderRadius: 1.5,

                              bgcolor: isWeekend ? "#ffeded" : "action.hover",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,

                                display: "block",

                                color: isWeekend
                                  ? "error.main"
                                  : "text.primary",
                              }}
                            >
                              {schedule.startTime}

                              {" - "}

                              {schedule.endTime}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",

                                display: "block",
                              }}
                            >
                              {schedule.slotDuration} phút/lượt
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ))}

                  {!isHoliday && hasBlockedSlots && !wholeDayBlocked && (
                    <Box
                      sx={{
                        mt: 1,

                        pt: 1,

                        borderTop: "1px dashed",

                        borderColor: "warning.main",
                      }}
                    >
                      <Chip
                        icon={<BlockIcon />}
                        label="Nghỉ đột xuất"
                        color="warning"
                        size="small"
                        sx={{
                          mb: 0.7,
                        }}
                      />

                      {dayBlockedSlots.map((blockedSlot) => (
                        <Box
                          key={blockedSlot.id}
                          sx={{
                            mb: 0.7,

                            "&:last-child": {
                              mb: 0,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",

                              fontWeight: 700,

                              color: "warning.dark",
                            }}
                          >
                            {dayjs(blockedSlot.startAt).format("HH:mm")}

                            {" - "}

                            {dayjs(blockedSlot.endAt).format("HH:mm")}
                          </Typography>

                          {blockedSlot.reason && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",

                                color: "text.secondary",

                                lineHeight: 1.3,
                              }}
                            >
                              {blockedSlot.reason}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mt: 3,

          p: 2,

          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,

            mb: 1.5,
          }}
        >
          Chú thích
        </Typography>

        <Box
          sx={{
            display: "flex",

            gap: 1,

            flexWrap: "wrap",
          }}
        >
          <Chip label="Hôm nay" color="primary" size="small" />

          <Chip
            label="Thứ 7 / Chủ nhật"
            color="error"
            variant="outlined"
            size="small"
          />

          <Chip label="Ngày nghỉ lễ" color="error" size="small" />

          <Chip
            icon={<BlockIcon />}
            label="Nghỉ đột xuất"
            color="warning"
            size="small"
          />
        </Box>
      </Paper>

      <Alert
        severity="info"
        sx={{
          mt: 3,
        }}
      >
        Lịch tháng được tổng hợp từ lịch làm việc hàng tuần, ngày nghỉ lễ và các
        khoảng thời gian bác sĩ đã chặn.
      </Alert>
    </Box>
  );
}

export default DoctorMonthlySchedule;
