export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      공급기업: {
        Row: {
          공급기업일련번호: string
          관심여부: string | null
          기업명: string | null
          기업홈페이지: string | null
          등록일자: string | null
          문의여부: string | null
          보유특허: string | null
          사용자명: string | null
          세부설명: string | null
          아이디: string | null
          업종: string | null
          유튜브링크: string | null
          유형: string | null
        }
        Insert: {
          공급기업일련번호: string
          관심여부?: string | null
          기업명?: string | null
          기업홈페이지?: string | null
          등록일자?: string | null
          문의여부?: string | null
          보유특허?: string | null
          사용자명?: string | null
          세부설명?: string | null
          아이디?: string | null
          업종?: string | null
          유튜브링크?: string | null
          유형?: string | null
        }
        Update: {
          공급기업일련번호?: string
          관심여부?: string | null
          기업명?: string | null
          기업홈페이지?: string | null
          등록일자?: string | null
          문의여부?: string | null
          보유특허?: string | null
          사용자명?: string | null
          세부설명?: string | null
          아이디?: string | null
          업종?: string | null
          유튜브링크?: string | null
          유형?: string | null
        }
        Relationships: []
      }
      수요기관: {
        Row: {
          관심여부: string | null
          금액: number | null
          기타요구사항: string | null
          등록일자: string | null
          문의일자: string | null
          부서명: string | null
          사용자명: string | null
          수요기관: string | null
          수요기관일련번호: string
          수요내용: string | null
          시작일: string | null
          아이디: string | null
          유형: string | null
          종료일: string | null
        }
        Insert: {
          관심여부?: string | null
          금액?: number | null
          기타요구사항?: string | null
          등록일자?: string | null
          문의일자?: string | null
          부서명?: string | null
          사용자명?: string | null
          수요기관?: string | null
          수요기관일련번호: string
          수요내용?: string | null
          시작일?: string | null
          아이디?: string | null
          유형?: string | null
          종료일?: string | null
        }
        Update: {
          관심여부?: string | null
          금액?: number | null
          기타요구사항?: string | null
          등록일자?: string | null
          문의일자?: string | null
          부서명?: string | null
          사용자명?: string | null
          수요기관?: string | null
          수요기관일련번호?: string
          수요내용?: string | null
          시작일?: string | null
          아이디?: string | null
          유형?: string | null
          종료일?: string | null
        }
        Relationships: []
      }
      회원관리: {
        Row: {
          기업명: string | null
          등록일자: string | null
          부서명: string | null
          비밀번호: string | null
          아이디: string
          연락처: string | null
          유형: string | null
          이름: string | null
          이메일: string | null
        }
        Insert: {
          기업명?: string | null
          등록일자?: string | null
          부서명?: string | null
          비밀번호?: string | null
          아이디: string
          연락처?: string | null
          유형?: string | null
          이름?: string | null
          이메일?: string | null
        }
        Update: {
          기업명?: string | null
          등록일자?: string | null
          부서명?: string | null
          비밀번호?: string | null
          아이디?: string
          연락처?: string | null
          유형?: string | null
          이름?: string | null
          이메일?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
