from fastapi import HTTPException


def raise_ghl_error(
    status_code: int,
    code: str,
    message: str,
    details: str | None = None,
) -> None:
    raise HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "message": message,
            "error": {
                "code": code,
                "details": details,
            },
        },
    )