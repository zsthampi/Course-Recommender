package package1;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class Excel {
	
	static Connection connection = getConnection();
	
	static Map<String, Course> map = new TreeMap<>();
	static Map<String, Course> pro = new TreeMap<>();
	
	public static void summary(Statement statement) throws SQLException{
		System.out.println("ID \t\t A \t B \t C\tTotal\tAvgClsSize");
		StringBuilder sb = new StringBuilder();
		sb.append("select * from gd");
		ResultSet rs = statement.executeQuery(sb.toString());
		while (rs.next()) {
			if(!"601".equals(rs.getString("section"))){
				String name = rs.getString("name");
				if(!map.containsKey(name)){
					map.put(name, new Course(name));
				}
				Course course = map.get(name);
				course.count++;
				course.setAs(course.getAs() + rs.getInt("as"));
				course.setBs(course.getBs() + rs.getInt("bs"));
				course.setCs(course.getCs() + rs.getInt("cs"));
				course.setTotal(course.getTotal() + rs.getInt("total"));
			}
			if(!"601".equals(rs.getString("section"))){
				String name = rs.getString("instructor");
				if(!pro.containsKey(name)){
					Course c = new Course();
					c.setInstructor(name);
					pro.put(name, c);
				}
				Course course = pro.get(name);
				course.count++;
				course.setAs(course.getAs() + rs.getInt("as"));
				course.setBs(course.getBs() + rs.getInt("bs"));
				course.setCs(course.getCs() + rs.getInt("cs"));
				course.setTotal(course.getTotal() + rs.getInt("total"));
			}
		}
		for (Map.Entry<String, Course> entry : map.entrySet()) {
		    StringBuilder s = new StringBuilder();
		    Course c = entry.getValue();		    		    
		    s.append(c.getName()).append("\t\t");
		    s.append(Math.round(((double)c.getAs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(Math.round(((double)c.getBs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(Math.round(((double)c.getCs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(c.getTotal()).append("\t");
		    s.append(c.getTotal()/c.count).append("\t");
		    System.out.println(s.toString());
		}
		System.out.println();
		System.out.println();
		System.out.println("A \t B \t C\tTotal\tAvgSize \t Professor");
		for (Map.Entry<String, Course> entry : pro.entrySet()) {
		    StringBuilder s = new StringBuilder();
		    Course c = entry.getValue();		    		    
		    s.append(Math.round(((double)c.getAs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(Math.round(((double)c.getBs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(Math.round(((double)c.getCs() / (double)c.getTotal())*10000.0)/100.0).append("\t");
		    s.append(c.getTotal()).append("\t");
		    s.append(c.getTotal()/c.count).append("\t");
		    s.append(c.getInstructor());
		    System.out.println(s.toString());
		}
	}
	
	static int a = 1;
	
	public static void insertion(Course course, Statement statement) throws SQLException{
		 // set timeout to 30 sec.
		StringBuilder sb = new StringBuilder();
		sb.append("insert into gradedists values(").append(a++).append(",'");
		sb.append(course.getCid()).append("','");
		//sb.append(course.getName()).append("','");
		sb.append(course.getSection()).append("','");
		sb.append(course.getInstructor()).append("','");
		sb.append(course.getSemester()).append("',");
		sb.append(course.getAs()).append(",");
		sb.append(course.getBs()).append(",");
		sb.append(course.getCs()).append(",");
		sb.append(course.getDs()).append(",");
		sb.append(course.getFs()).append(",");
		sb.append(course.getS()).append(",");
		sb.append(course.getU()).append(",");
		sb.append(course.getIn()).append(",");
		sb.append(course.getLa()).append(",");
		sb.append(course.getAu()).append(",");
		sb.append(course.getNr()).append(",");
		sb.append(course.getW()).append(",");
		sb.append(course.getTotal()).append(",0,0)");
		statement.executeUpdate(sb.toString());
	}
	
	public static Connection getConnection(){
		Connection connection = null;
		try {
			connection = DriverManager.getConnection("jdbc:sqlite:/Users/fuxing/Desktop/development.sqlite3");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return connection;
	}
	
	public static Course pack(int[] ints, String[] strings, Statement statement, int cid) throws SQLException{
		Course course = new Course(strings[0], strings[1], strings[2], strings[3], ints[0], 
				ints[1], ints[2], ints[3], ints[4], ints[5], ints[6],
				ints[7], ints[8], ints[9], ints[10], ints[11], ints[12]);
		course.setCid(cid);
		for (String j : strings) {
			System.out.print(j + " ");
		}
		for (int j : ints) {
			System.out.print(j + " ");
		}
		System.out.println();
		insertion(course, statement);
		return course;
	}
	
	
	public static void write(Statement statement) throws IOException, SQLException{
		File folder = new File("/Users/fuxing/Desktop/gd");
		File[] listOfFiles = folder.listFiles();
		for (File file : listOfFiles) {
		    if (file.isFile()) {
		    	if(file.getName().charAt(0) != '5'){
		    		continue;
		    	}
				FileInputStream fileInputStream = new FileInputStream(file);
				InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);
				BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
				String line = bufferedReader.readLine();
				int index = 0;
				String[] strings = new String[4];
				strings[3] = file.getName().substring(4, 7);
				int[] ints = new int[13];
				while (line != null) {
					if(index == 24 || index == 41 || index == 58 || index == 75){
						pack(ints, strings, statement, Integer.valueOf(file.getName().substring(0,3)));
						ints = new int[13];
						strings = new String[4];
						strings[3] = file.getName().substring(4, 7);
						index = 7;
					}
					if (index < 7) {
						index++;
						line = bufferedReader.readLine();
						continue;
					}
					StringBuilder sb1 = new StringBuilder();
					boolean flag = true;
					for (int j = 0; j < line.length(); j++) {
						if (flag && line.charAt(j) != '>')
							continue;
						flag = false;
						if (index < 10 && line.charAt(j) == '<') {
							strings[index - 7] = sb1.substring(1);
							break;
						} else if (index >= 10 && (line.charAt(j) == ' ' || line.charAt(j) == '(' || line.charAt(j) == '<')) {
							if (sb1.length() > 1) {
								ints[index - 10] = Integer.parseInt(sb1.substring(1));
							}
							break;
						}
						sb1.append(line.charAt(j));
					}
					line = bufferedReader.readLine();
					index++;
				}
				pack(ints, strings, statement, Integer.valueOf(file.getName().substring(0,3)));
				bufferedReader.close();
				inputStreamReader.close();
				fileInputStream.close();
		    }
		}
		connection.close();
	}
	
	
	public void read(){
		
	}
	
	public static void main(String[] args) throws IOException, SQLException {
		Statement statement = connection.createStatement();
		statement.setQueryTimeout(30);
		write(statement);
	}
	
	
}
