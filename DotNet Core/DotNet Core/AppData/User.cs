using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace users.AppData
{
    public class UserInfo {
        public int? id { get; set; }
        public string? firstname { get; set; }
        public string? lastname { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? avatar { get; set; }
        public string? password { get; set; }
        public int? OTP_Pin { get; set; }
        public bool? isLoogedIn { get; set; }
    }
}
